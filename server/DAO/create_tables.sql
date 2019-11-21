DROP TABLE IF EXISTS nyhetssaker;
CREATE TABLE nyhetssaker (
  id int(11) NOT NULL auto_increment,
  author varchar(60) NOT NULL,
  header varchar(50) NOT NULL,
  content mediumtext,
  published varchar(30) NOT NULL ,
  picture longtext,
  category varchar(50) NOT NULL,
  importance int NOT NULL,
  rating int(11),
  primary key (id)
);

DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
  commentId int(11) NOT NULL AUTO_INCREMENT,
  comment varchar(225) NOT NULL,
  articleId int(11) NOT NULL,
  nick varchar(225) NOT NULL,
  primary key (commentId),
  KEY fk_articleId (articleId),
  CONSTRAINT fk_articleId FOREIGN KEY (articleId) REFERENCES nyhetssaker (id)
);
