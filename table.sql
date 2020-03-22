CREATE TABLE `td_cat` (
  `cat_id` int(8)  NOT NULL auto_increment,
  `category_name` varchar(255) collate utf8_unicode_ci NOT NULL default '' , 
  PRIMARY KEY  (`cat_id`),
  UNIQUE(`category_name`)
);



CREATE TABLE `td_list` (
  `td_id` int(8) unsigned NOT NULL auto_increment,
  `category_id` int(8) NOT NULL,
  `title` varchar(255) collate utf8_unicode_ci NOT NULL default '',
  `status` int(2) NOT NULL,
  `created_at`  timestamp NOT NULL default CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`td_id`)
) ;


ALTER TABLE `td_list` ADD FOREIGN KEY (`category_id`) REFERENCES `td_cat`(`cat_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;