CREATE TABLE `players` (
	`license` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`discord` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`ip` VARCHAR(25) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`model` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`job` VARCHAR(15) NOT NULL DEFAULT 'unemployed' COLLATE 'utf8_general_ci',
	`job_rank` INT(1) NOT NULL DEFAULT '0',
	`location` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`level` INT(1) NOT NULL DEFAULT '0',
	`rank` INT(11) NOT NULL DEFAULT '1',
	`group` INT(11) NOT NULL DEFAULT '1',
	`dead` TINYINT(1) NOT NULL DEFAULT '0',
	`skin` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`identity` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`license`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;