<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: matt_hung
 * Date: 2015/9/14
 * Time: 下午 07:40
 */

include_once(APPPATH.'/controllers/BaseController.php');

define('Session_key_account', 'account');
define('Min_Account_Len', 5);
define('Max_Account_Len', 30);

define('Min_Password_Len', 8);
define('Max_Password_Len', 30);

class Login extends BaseController{
    public function index(){}

    public function CreateAccount($account=null, $password=null, $code_CAPTCHA=null){
        if ($account == null){
            $this->respond('Invalid arguments');
            return;
        }

        if ($password == null){
            $this->respond('Invalid arguments');
            return;
        }

        if ($code_CAPTCHA == null){
            $this->respond('Invalid arguments');
            return;
        }

        $result=array(
            'status' => '',
            'data'   =>null
        );

        if(!$this->rpHash($code_CAPTCHA))
        {
            $this->respond('Validation error!!');
            return;
        }

        if(!$this->db_account->create_account($account, $password)) {
            $this->respond('Duplicate account!');
            return;
        }

        if(!$this->validation_account($account)){
            $this->respond('Invalid account length !');
            return;
        }

        if(!$this->validation_password($account)){
            $this->respond('Invalid password length !');
            return;
        }

        $this->RequestLogin($account, $password);
    }

    public function RequestLogin($account=null, $password=null)
    {
        if ($account == null){
            $this->respond('Invalid arguments');
            return;
        }

        if ($password == null){
            $this->respond('Invalid arguments');
            return;
        }

        $login_result=$this->db_account->select_account($account, $password);

        if($login_result==null){
            $this->respond('Account doestn"t exist!');
            return;
        }

        if(!$this->validation_account($account)){
            $this->respond('Invalid account length !');
            return;
        }

        if(!$this->validation_password($account)){
            $this->respond('Invalid password length !');
            return;
        }

        $this->session->set_userdata(Session_key_account, $login_result);
    }

    private function respond($message, $data=null){
        $result['status']=$message;
        $result['data']=$data;
        echo json_encode($result);
    }

    private function validation_account($account){
        if(strlen($account) < Min_Account_Len)
            return false;
        if(strlen($account) > Max_Account_Len)
            return false;

        return true;
    }

    private function validation_password($password){
        if(strlen($password) < Min_Password_Len)
            return false;
        if(strlen($password) > Max_Password_Len)
            return false;

        return true;
    }

    private function rpHash($value) {
        $hash = 5381;
        $value = strtoupper($value);
        for($i = 0; $i < strlen($value); $i++) {
            $hash = (($hash << 5) + $hash) + ord(substr($value, $i));
        }
        return $hash;
    }
}
