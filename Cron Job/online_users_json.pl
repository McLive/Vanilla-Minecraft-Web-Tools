#!/usr/bin/perl
use File::Tail;

my $serverlog  = '/home/customer/minecraft/server.log';
my $outputjson = '/var/www/online_users.json';

my %online = ();
my $ft = File::Tail->new(
  name => $serverlog,
  interval    => 10,
  maxinterval => 30,
  adjustafter => 10,
  tail        => 100,
);

while (defined($line = $ft->read)) {
  if ($line =~ /INFO\]\s*(\w+)\s*.*logged in/) {
    $online{$1} = 1;
    update_status_file();
    system('sh','mccom.sh',"tell $1 Welcome to MCrafters.tk");
    broadcast_msg();
  }
  elsif ($line =~ /INFO\]\s*(\w+)\s*.*lost connection/) {
    $online{$1} = 0;
    update_status_file();
  }
  elsif ($line =~ /INFO\].*Kicking\s*(\w+)/) {
    $online{$1} = 0;
    update_status_file();
  }
  elsif ($line =~ /WARNING\]\s*(\w+)\s*.*was kicked/) {
    $online{$1} = 0;
    update_status_file();
  }
  elsif ($line =~ /INFO\]\s*.*Stopping server/) {
    my %online = ();
    update_status_file();
  }
  elsif ($line =~/INFO\]\s*.*Starting minecraft server/) {
    my %online = ();
    update_status_file();
  }
}

sub update_status_file {
  open my $out, '>', $outputjson;
  my $odata = "{\n";
  $odata .= '"online_users": [ ';
  for my $user (sort keys %online) {
    $odata .= '"' . $user . '",' if $online{$user};
  }
  $odata = substr($odata,0,length($odata) - 1);
  $odata .= "]\n}\n";
  print $out $odata;
  close $out;
}

sub broadcast_msg {
  my $msg = 'say Online Users: ';
  for my $user (sort keys %online) {
    $msg .= $user . ', ' if $online{$user};
  }
  $msg = substr($msg,0,length($msg) - 2);
  system('sh','/home/customer/mccom.sh',$msg);
}
