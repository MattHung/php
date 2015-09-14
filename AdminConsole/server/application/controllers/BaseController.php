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
    }

    public function index(){

    }

    private function check_db_initial(){
        $this->db_account->check_database_exist();
        $this->db_account->check_table_exist();
    }
}