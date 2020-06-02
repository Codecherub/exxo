<?php
header('set');
$db =mysqli_connect('localhost','root','','exxo');
if(isset($_REQUEST['newGame'])){
    $host = $_REQUEST['gameHost'];
    $form = $_REQUEST['gameForm'];
    $startTone = $_REQUEST['startTone'];
    $playerForm = 'x';
    if($form === 'x'){
        $playerForm='o';
    }
    $gameID = $_REQUEST['gameID'];
    if(mysqli_query($db,"insert into games(gameId,gameHost,gameForm,gamePlayerForm,tone) 
    values('$gameID','$host','$form','$playerForm','$startTone') ")){
        $res = array(
            'msg'=>'awaiting connection. . .',
            'action'=>array('msg'),
            'blob' => ''
        );
    } else {
        $res = array(
            'msg'=>'unable to Host challenge . .',
            'action'=>array('fail'),
            'blob' => ''
        );
    }
}

else if(isset($_REQUEST['joinGame'])){
    $gameID = $_REQUEST['gameID'];
    $gamePlayer =$_REQUEST['gamePlayer'];
    $sql = mysqli_query($db,"select * from games where gameId='$gameID' and gamePlayer='' ");
    if(mysqli_num_rows($sql) > 0){
        // create handshake
        mysqli_query($db,"update games set gamePlayer='$gamePlayer', stat='start' where  gameId='$gameID' ");
        $get = mysqli_fetch_array($sql);
        $res = array(
            'msg'=>'youre now playing as '.$get['gamePlayerForm'],
            'action'=>array('startGame'),
            'blob' => array('opp'=>$get['gameHost'],'form'=>$get['gamePlayerForm']),
            'tone'=>$get['tone']
        ); 
    } else {
        $res = array(
            'msg'=>'invalid game ID '.$gameID,
            'action'=>array('invalid'),
            'blob' => ''
        ); 
    }
}

else if(isset($_REQUEST['listen'])){
    $gameID = $_REQUEST['gameID'];
    $lestener =$_REQUEST['listen'];
    $sql = mysqli_query($db,"select * from games where gameId='$gameID'  ");
  
        // create handshake
        $get = mysqli_fetch_array($sql);
        $res = array(
            'tone'=>$get['tone'],
            'action'=>array('startGame'),
            'blob' => array('opp'=>$get['gameHost'],'form'=>$get['gamePlayerForm'])
        ); 

}

else if(isset($_REQUEST['listener'])){
    $gameID = $_REQUEST['gameID'];
    $lestener =$_REQUEST['listener'];
    $tone =$_REQUEST['tone'];
    $sql = mysqli_query($db,"select * from games where gameId='$gameID'  ");
    $sqlX = mysqli_query($db,"select * from gameplay where gameId='$gameID'  ");
    while($getX = mysqli_fetch_array($sqlX)){
        $gtX =$getX;
    }
    $sql2 = mysqli_query($db,"select * from gameplay where gameId='$gameID' and tone = '$tone' order by id desc limit 1 ");
    $get = mysqli_fetch_array($sql);
    if($tone == $get['tone']){
        $res = array(
            'recognition'=>true
        );
    }else{
        $get2 = mysqli_fetch_array($sql2);
        $res = array(
            'tone'=>$get['tone'],
            'to'=>$getX['action'],
            'val' => $getX["player"],
            'tune' => $getX["tone"],
            'mG'=>$gtX
        ); 
    }
       

}



else if(isset($_REQUEST['startx'])){
    $gameID = $_REQUEST['gameID'];
    $sql = mysqli_query($db,"select * from games where gameId='$gameID'  ");
  
        // create handshake
        $get = mysqli_fetch_array($sql);
        $res = array(
            'stat'=>$get['stat'],
            'action'=>array('startGame'),
            'blob' => array('opp'=>$get['gamePlayer'],'form'=>$get['gameForm'])
        ); 

}

else if(isset($_REQUEST['play'])){
    $play = $_REQUEST['play'];
    $app = $_REQUEST['app'];
    $gameID = $_REQUEST['gameID'];
    $newTone = $_REQUEST['newtone'];
    if(mysqli_query($db,"update games set tone='$newTone' where gameId='$gameID'")){
        mysqli_query($db,"insert into gamePlay(player,action,gameId,tone) values('$app','$play','$gameID','$newTone')");
        $sql = mysqli_query($db,"select * from games where gameId='$gameID'  ");
  
       
        $get = mysqli_fetch_array($sql);
        $res = array(
            'stat'=>1,
            'newtone'=>$newTone
        ); 
    }else{
        $res = array(
            'stat'=>0
        ); 
    }
   

}

else {
    $res = array(
        'msg'=>'failed to connect . .',
        'action'=>array('msg'),
        'blob' => ''
    );
}

echo (json_encode($res));