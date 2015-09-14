<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: matt_hung
 * Date: 2015/9/14
 * Time: 下午 03:39
 */

class Model_account extends CI_Model{
    private static $m_db_Account_Checker = NULL;
    private static $m_db_Account = NULL;

    public function __construct(){
        parent::__construct();
    }

    public function check_database_exist(){
        if(is_null(Model_account::$m_db_Account_Checker))
            Model_account::$m_db_Account_Checker = $this->load->database('account_check_database_exist', true);

        Model_account::$m_db_Account_Checker->simple_query(sprintf("CREATE DATABASE IF NOT EXISTS `%s`", DatabaseName));
    }

    public function check_table_exist(){
        if(is_null(Model_account::$m_db_Account))
            Model_account::$m_db_Account=$this->load->database('account', true);

        $query =sprintf("CREATE TABLE IF NOT EXISTS `%s`", Table_Account);
        $query =$query." (";
        $query =$query."	`id` INT(11) NOT NULL AUTO_INCREMENT,";
        $query =$query."	`account` INT(11) NOT NULL DEFAULT '0',";
        $query =$query."	`password` CHAR(50) NOT NULL DEFAULT '''',";
        $query =$query."	PRIMARY KEY (`id`)";
        $query =$query.")";
        $query =$query."ENGINE=InnoDB;";


        Model_account::$m_db_Account->simple_query($query);
    }

}