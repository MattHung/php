<?php
    echo 'test';
    $config = array(
        "base_url" => "http://192.168.7.222/matt/hybridauth-2.3.0/hybridauth/",
        "providers" => array (
            "Facebook" => array (
                "enabled" => true,
                "keys"    => array ( "id" => "1484919005063845", "secret" => "c1d3823cd37566c199aecba44f184372" ),
                "scope"   => "email",
//                "scope"   => "email, user_about_me, user_birthday, user_hometown", // optional
                "display" => "popup" // optional
            )));

    require_once( "../../hybridauth/Hybrid/Auth.php" );

    $hybridauth = new Hybrid_Auth( $config );

    $adapter = $hybridauth->authenticate( "Facebook" );

    $user_profile = $adapter->getUserProfile();

?>