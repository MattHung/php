<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: matt_hung
 * Date: 2015/9/14
 * Time: 下午 03:35
 */

class BaseController extends CI_Controller{

    public function __construct(){
        parent::__construct();

        $this->load->model('model_account', 'db_account');
        $this->check_db_initial();

        $this->load->library('session');
        $this->load->helper('url');

//        if(!$this->check_session_valid())
//            return;

        $this->load->library('javascript');
        $this->load->helper('cookie');
        $this->load->helper('directory');
        $this->load->helper('form');
        $this->load->helper('language');
        $this->load->helper('path');
        $this->load->helper('html');

    }

    private function check_session_valid(){

        $account=$this->session->userdata('account');

        if(is_null($account)) {
            redirect(base_url());
            return false;
        }

        return true;
    }

    private function check_db_initial(){
        $this->db_account->check_database_exist();
        $this->db_account->check_table_exist();
    }
}