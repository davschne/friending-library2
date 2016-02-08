var user1 = {
  uid: 12345,
  display_name: "Philip",
  access_token: "v583ms"
};

var user2 = {
  uid: 16829,
  display_name: "David",
  access_token: "cvasr32"
};

var user3 = {
  uid: 2486,
  display_name: "Brandon",
  access_token: "kjlewq02"
};

var user4 = {
  uid: 8473,
  display_name: "Colin",
  access_token: "uiowqe879803"
};

var book1 = {
  isbn: "9781612130286",
  title: "Fifty Shades of Grey",
  subtitle: "",
  authors: [
   "E. L. James"
  ],
  publisher: "Zas4ita",
  publisheddate: "2015-03-25",
  description: "MORE THAN 100 MILLION COPIES SOLD WORLD WIDE. When literature student Anastasia Steele interviews successful entrepreneur Christian Grey, she finds him very attractive and deeply intimidating. Convinced that their meeting went badly, she tries to put him out of her mind – until he turns up at the store where she works part-time, and invites her out. Unworldly and innocent, Ana is shocked to find she wants this man. And, when he warns her to keep her distance, it only makes her want him more. As they embark on a passionate love affair, Ana discovers more about her own desires, as well as the dark secrets Christian keeps hidden away from public view ... Motion Picture Artwork © 2014 Universal Studios. All Rights Reserved.",
  pagecount: 380,
  categories: [ "Fiction" ],
  language: "en",
  imagelink: "http://books.google.com/books/content?id=VXSVBwAAQBAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
  volumelink: "http://books.google.com/books/about/Fifty_Shades_of_Grey.html?hl=&id=msDVBgAAQBAJ"
};

var book2 = {
  isbn: "9780747532699",
  title: 'Harry Potter 1 and the Philosopher\'s Stone',
  authors: [ 'J. K. Rowling' ],
  publisher: 'Bloomsbury Pub Limited',
  publisheddate: '1997',
  description: 'Harry Potter is an ordinary boy who lives in a cupboard under the stairs at his Aunt Petunia and Uncle Vernon\'s house, which he thinks is normal for someone like him who\'s parents have been killed in a \'car crash\'. He is bullied by them and his fat, spoilt cousin Dudley, and lives a very unremarkable life with only the odd hiccup (like his hair growing back overnight!) to cause him much to think about. That is until an owl turns up with a letter addressed to Harry and all hell breaks loose! He is literally rescued by a world where nothing is as it seems and magic lessons are the order of the day. Read and find out how Harry discovers his true heritage at Hogwarts School of Wizardry and Witchcraft, the reason behind his parents mysterious death, who is out to kill him, and how he uncovers the most amazing secret of all time, the fabled Philosopher\'s Stone! All this and muggles too. Now, what are they?',
  pagecount: 223,
  categories: [ 'Juvenile Fiction' ],
  language: 'en',
  imagelink: 'http://books.google.com/books/content?id=yZ1APgAACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api',
  volumelink: "http://books.google.com/books/about/Harry_Potter_1_and_the_Philosopher_s_Sto.html?hl=&id=yZ1APgAACAAJ"
};

var book3 = {
  isbn: "9780804139038",
  title: 'The Martian',
  subtitle: 'A Novel',
  authors: [ 'Andy Weir' ],
  publisher: 'Broadway Books',
  publisheddate: '2014-02-11',
  description: 'Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he\'s sure he\'ll be the first person to die there. After a dust storm nearly kills him and forces his crew to evacuate while thinking him dead, Mark finds himself stranded and completely alone with no way to even signal Earth that he’s alive—and even if he could get word out, his supplies would be gone long before a rescue could arrive. Chances are, though, he won\'t have time to starve to death. The damaged machinery, unforgiving environment, or plain-old "human error" are much more likely to kill him first. But Mark isn\'t ready to give up yet. Drawing on his ingenuity, his engineering skills—and a relentless, dogged refusal to quit—he steadfastly confronts one seemingly insurmountable obstacle after the next. Will his resourcefulness be enough to overcome the impossible odds against him?',
  pagecount: 384,
  categories: [ 'Fiction' ],
  language: 'en',
  imagelink: 'http://books.google.com/books/content?id=MQeHAAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
  volumelink: "http://books.google.com/books/about/The_Martian.html?hl=&id=MQeHAAAAQBAJ"
};

var book4 = {
  isbn: "9781451678192",
  title: 'The Martian Chronicles',
  authors: [ 'Ray Bradbury' ],
  publisher: 'Simon and Schuster',
  publisheddate: '2012-04-17',
  description: 'The tranquility of Mars is disrupted by humans who want to conquer space, colonize the planet, and escape a doomed Earth.',
  pagecount: 256,
  categories: [ 'Fiction' ],
  language: 'en',
  imagelink: 'http://books.google.com/books/content?id=HzQXlPS48PQC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
  volumelink: "http://books.google.com/books/about/The_Martian_Chronicles.html?hl=&id=HzQXlPS48PQC"
};

module.exports = {
  users: [user1, user2, user3, user4],
  books: [book1, book2, book3, book4]
};
