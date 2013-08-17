SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `jesse_matt` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `jesse_matt` ;

-- -----------------------------------------------------
-- Table `jesse_matt`.`players`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jesse_matt`.`players` ;

CREATE  TABLE IF NOT EXISTS `jesse_matt`.`players` (
  `id` INT NOT NULL ,
  `name` VARCHAR(100) NULL ,
  `level` INT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jesse_matt`.`deck`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jesse_matt`.`deck` ;

CREATE  TABLE IF NOT EXISTS `jesse_matt`.`deck` (
  `id` INT NOT NULL ,
  `maxAmout` INT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jesse_matt`.`deckMonsters`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jesse_matt`.`deckMonsters` ;

CREATE  TABLE IF NOT EXISTS `jesse_matt`.`deckMonsters` (
  `id` INT NOT NULL ,
  `name` VARCHAR(45) NULL ,
  `level` VARCHAR(45) NULL ,
  `hp` INT NULL ,
  `str` INT NULL ,
  `xp` INT NULL ,
  `multiplier` DOUBLE NULL ,
  `player_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_deckMonsters_player_idx` (`player_id` ASC) ,
  CONSTRAINT `fk_deckMonsters_player`
    FOREIGN KEY (`player_id` )
    REFERENCES `jesse_matt`.`players` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jesse_matt`.`allMonsters`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `jesse_matt`.`allMonsters` ;

CREATE  TABLE IF NOT EXISTS `jesse_matt`.`allMonsters` (
  `name` VARCHAR(100) NOT NULL ,
  `baseHp` INT NULL ,
  `baseStr` INT NULL ,
  `baseXp` INT NULL ,
  `multiplier` DOUBLE NULL ,
  PRIMARY KEY (`name`) )
ENGINE = InnoDB;

USE `jesse_matt` ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
