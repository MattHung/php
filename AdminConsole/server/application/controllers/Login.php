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

    public function CreateAccount($account=null, $password=null, $code=null, $code_CAPCHA=null){
        if ($account == null){
            $this->respond('Field "email" is required !');
            return;
        }

        if ($password == null){
            $this->respond('Field "password" is required !');
            return;
        }

        if ($code == null){
            $this->respond('Please enter the letters displayed !');
            return;
        }

        $result=array(
            'status' => '',
            'data'   =>null
        );

        if(is_null($code_CAPCHA))
            return;

        if($this->rpHash($code)!=$code_CAPCHA)
        {
            $this->respond('Validation error!!');
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

        if(!$this->db_account->create_account(base64_decode($account), $password)) {
            $this->respond('Account already exist !');
            return;
        }

        $this->respond('Create Account Success !');

//        $this->RequestLogin($account, $password);
    }

    public function RequestLogin($account=null, $password=null)
    {
        if ($account == null){
            $this->respond('Field "email" is required !');
            return;
        }

        if ($password == null){
            $this->respond('Field "password" is required !');
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

        $account=base64_decode($account);

        $login_result=$this->db_account->select_account($account, $password);

        if($login_result==null){
            $this->respond('Account doestn"t exist!');
            return;
        }

        if($login_result['password']!=$password){
            $this->respond('Password Error!');
            return;
        }

        $this->respond('Login Success !');

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
