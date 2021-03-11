CREATE TABLE `whitelist` (
	`discord` VARCHAR(30) NOT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`discord`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;


CREATE TABLE `players` (
	`license` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`discord` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`ip` VARCHAR(25) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`model` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`group` INT(11) NOT NULL DEFAULT '1',
	`level` INT(1) NOT NULL DEFAULT '0',
	`rank` INT(11) NOT NULL DEFAULT '1',
	`job` INT(1) NOT NULL DEFAULT '1',
	`job_rank` INT(1) NOT NULL DEFAULT '0',
	`location` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`dead` TINYINT(1) NOT NULL DEFAULT '0',
	`character` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`license`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `bans` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`identifiers` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`time` INT(11) NULL DEFAULT NULL,
	`reason` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`banner` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`date` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=2
;
