create database atividadePortaria;
use atividadePortaria;

create table moradores(
	id int primary key not null auto_increment,
    nome varchar(100),
    bloco varchar(4),
    apartamento int,
    telefone int unique,
    email varchar(255) unique,
    status enum("residente", "proprietario", "visitante") default("residente"), -- Ver se precisa arrumar essa linha
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


create table veiculos(
	id int primary key not null auto_increment,
    placa varchar(7) not null unique,
    modelo varchar(100),
    cor varchar(45),
    -- morador_id int not null unique,
    box varchar(50) not null unique,
    email varchar(255) unique,
    criado_em timestamp DEFAULT CURRENT_TIMESTAMP,
    -- foreign key(placa) references moradores(email)
    foreign key(email) references moradores(email)
);