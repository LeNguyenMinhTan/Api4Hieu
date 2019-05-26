drop database CustomerSystem

create database CustomerSystem
go
use CustomerSystem
go

Create table U_User(
	u_username VARCHAR(50) Not null Primary Key,
    u_password VARCHAR(50) NULL
)


Create table Student
(
	studentid INT NOT NULL,
	firstname VARCHAR(50) NULL,
	lastname VARCHAR(50) NULL,
	birthday DATETIME NULL,
	sex INT(1) NULL,
	status INT(1) NULL,
	placebirth VARCHAR(50) NULL,
	note TEXT NULL,
	phonefamily INT(10) NULL,
	phonecontact INT(10) NULL,
	phonemobile INT(10) NULL,
	classid INT(12) NOT NULL,
Primary Key (studentid)
) 

Create table UGroup
(
	groupid INT(12) NOT NULL,
	groupname VARCHAR(50) NULL,
Primary Key (groupid)
) 


Create table Soursegroup
(
	soursegroupid INT(12) NOT NULL,
	souregroupname VARCHAR(50) NULL,
Primary Key (soursegroupid)
) 


Create table Sourse
(
	sourseid INT(12) NOT NULL,
	soursename VARCHAR(50) NULL,
	soursecode VARCHAR(10) NULL,
	credit INT(1) NULL,
	soursegroupid INT(12) NOT NULL,
Primary Key (sourseid)
) 


Create table Lecturer
(
	lecturerid INT(12) NOT NULL,
	firstname VARCHAR(50) NULL,
	lastname VARCHAR(50) NULL,
	lecturerphone INT(10) NULL,
	lectureremail VARCHAR(50) NULL,
	lecturerbirth DATETIME NULL,
	SHS FLOAT NULL,
Primary Key (lecturerid)
) 


Create table USession
(
	sessionid INT(12) NOT NULL,
	startsession DATETIME NULL,
	weekday DATETIME NULL,
	endsession DATETIME NULL,
	startdate DATETIME NULL,
	enddate DATETIME NULL,
	startweek DATETIME NULL,
	endweek DATETIME NULL,
	sourseid INT(12) NOT NULL,
Primary Key (sessionid)
) 

Create table Room
(
	roomid INT(12) NOT NULL,
	roomname VARCHAR(20) NULL,
Primary Key (roomid)
) 


Create table Class
(
	classid INT(12) NOT NULL,
	classname VARCHAR(50) NULL,
	groupid INT(12) NOT NULL,
Primary Key (classid)
) 


Create table Detail_Teaching
(
	lecturerid INT(12) NOT NULL,
	sessionid INT(12) NOT NULL,
	roomid INT(12) NOT NULL,
Primary Key (lecturerid,sessionid,roomid)
) 


Create table Detail_Sourse
(
	studentid INT(12) NOT NULL,
	sourseid INT(12) NOT NULL,
Primary Key (studentid,sourseid)
) 



Alter table Detail_Sourse add  foreign key(studentid) references Student (studentid)  

Alter table Class add  foreign key(groupid) references UGroup (groupid)  

Alter table Sourse add  foreign key(soursegroupid) references Soursegroup (soursegroupid)  

Alter table USession add  foreign key(sourseid) references Sourse (sourseid)  

Alter table Detail_Sourse add  foreign key(sourseid) references Sourse (sourseid)  

Alter table Detail_Teaching add  foreign key(lecturerid) references Lecturer (lecturerid)  

Alter table Detail_Teaching add  foreign key(sessionid) references uSession (sessionid)  

Alter table Detail_Teaching add  foreign key(roomid) references Room (roomid)  

Alter table Student add  foreign key(classid) references Class (classid)  


