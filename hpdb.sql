DROP TABLE IF EXISTS `Students`;
DROP TABLE IF EXISTS `Houses`;
DROP TABLE IF EXISTS `Professors`;
DROP TABLE IF EXISTS `Classes`;
DROP TABLE IF EXISTS `Classes`;

CREATE TABLE `Students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `house` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `house` (`house`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`house`) REFERENCES `Houses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB

CREATE TABLE `Professors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `house` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `house` (`house`),
  CONSTRAINT `professors_ibfk_1` FOREIGN KEY (`house`) REFERENCES `Houses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB

CREATE TABLE `Enrolled` (
  `sid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  CONSTRAINT `enrolled_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `Students` (`id`),
  CONSTRAINT `enrolled_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `Classes` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `Houses` (
  `hid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `head_prof` int(11) NOT NULL,
  PRIMARY KEY (`hid`),
  KEY `head_prof` (`head_prof`),
  CONSTRAINT `houses_ibfk_1` FOREIGN KEY (`head_prof`) REFERENCES `Professors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB

INSERT INTO Students (fname, lname, house)
VALUES
(Harry, Potter, Gryffindor),
(Ron, Weasley, Gryffindor),
(Ginny, Weasley, Gryffindor),
(Zabini, Blaise, Slytherin),
(Justin, Finch, Hufflepuff),
(Mandy, Brocklehurst, Ravenclaw);


INSERT INTO Professors (fname, lname, house)
VALUES
(Minerva, McGonagall, Gryffindor),
(Severus, Snape, Slytherin),
(Pomona, Sprout, Hufflepuff),
(Filius, Flitwick, Ravenclaw);



INSERT INTO Houses (name, head_prof)
VALUES
(Gryffindor, (SELECT id FROM Professors WHERE lname == ‘McGonagall’))
(Slytherin, (SELECT id FROM Professors WHERE lname == ‘Snape’)) 
(Hufflepuff, (SELECT id FROM Professors WHERE lname == ‘Sprout’))
(Ravenclaw, (SELECT id FROM Professors WHERE lname == ‘Flitwick’));



INSERT INTO Classes (name, teacher)
VALUES
(Potions, (SELECT id FROM Professors WHERE lname = “Snape”)),
(Charms, (SELECT id FROM Professors WHERE lname = “Flitwick”)),
(Transfiguration, (SELECT id FROM Professors WHERE lname = “McGonagall”)),
(Herbology, (SELECT id FROM Professors WHERE lname = “Sprout”));

INSERT INTO Enrolled (sid, cid)
VALUES
((SELECT id FROM Students WHERE lname = “Potter” AND fname = “Harry”),(SELECT id FROM Classes WHERE name = “Charms”)),
((SELECT id FROM Students WHERE lname = “Weasley” AND fname = “Ron”),(SELECT id FROM Classes WHERE name = “Potions”)),
((SELECT id FROM Students WHERE lname = “Weasley” AND fname = “Ginny”),(SELECT id FROM Classes WHERE name = “Transfiguration”));
