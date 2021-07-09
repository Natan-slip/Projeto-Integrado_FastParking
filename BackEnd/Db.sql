create database ProjetoIntegradoFastParking;

use ProjetoIntegradoFastParking;

create table tblCarros (
	idCarro int primary key auto_increment,
    nome varchar(45) not null,
    placa varchar(8) not null,
    dataEntrada date not null,
    horaEntrada time not null,
    horaSaida time,
	valorPago decimal,
    idPreco int not null,
    unique key (idCarro),
	constraint FK_Precos_Carros
    foreign key (idPreco) 
    references tblPrecos (idPreco)
);

drop table tblCarros, tblPrecos;
select * from tblPrecos;

create table tblPrecos (
	idPreco int primary key auto_increment,
    primeiraHora int not null,
    demaisHoras int not null,
    dataHora datetime,
    unique key (idPreco)
);
        
insert into tblCarros (nome, placa, dataEntrada, horaEntrada, idPreco) 
	values ('Rosilda Alvez','ABC-1524', '2021-03-14', '18:00:00', 1 );
    
INSERT INTO tblPrecos (dataHora, primeiraHora, demaisHoras) VALUES  (now(), 2, 10);

select * from tblPrecos;