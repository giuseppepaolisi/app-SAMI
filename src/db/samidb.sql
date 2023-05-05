CREATE DATABASE samidb;

CREATE TABLE utente (
user varchar(16),
nome varchar(64),
cognome varchar(64),
email varchar(64),
password varchar(32),
num_telefono varchar(16)
);

CREATE TABLE produzione_bonnell (
macchina varchar(64),
diametro_filo float,
diametro_molla float,
giri_molla int,
num_molle_prodotte int,
ore_lavorate int,
data date,
ora time
);

CREATE TABLE produzione_pocket (
macchina varchar(64),
produttore_filo varchar(64),
diametro_filo float,
portata float,
peso float,
num_molle_prodotte int,
ore_lavorate int,
data date,
ora time
);

CREATE TABLE macchina (
nome varchar(64),
ore_standard int
);

CREATE TABLE reparti (
    
)