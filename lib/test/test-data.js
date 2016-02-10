var users = [
  {
    uid: 16829,
    display_name: "David",
    access_token: "cvasr32"
  },
  {
    uid: 12345,
    display_name: "Philip",
    access_token: "v583ms"
  },
  {
    uid: 2486,
    display_name: "Brandon",
    access_token: "kjlewq02"
  },
  {
    uid: 8473,
    display_name: "Colin",
    access_token: "uiowqe879803"
  },
  {
    uid: 98732,
    display_name: "Penny",
    access_token: "ioe4mv9vh"
  }
];

var books = [
  {
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
  },

  {
    isbn: "9780747532699",
    title: 'Harry Potter 1 and the Philosopher\'s Stone',
    subtitle: "",
    authors: [ 'J. K. Rowling' ],
    publisher: 'Bloomsbury Pub Limited',
    publisheddate: '1997',
    description: 'Harry Potter is an ordinary boy who lives in a cupboard under the stairs at his Aunt Petunia and Uncle Vernon\'s house, which he thinks is normal for someone like him who\'s parents have been killed in a \'car crash\'. He is bullied by them and his fat, spoilt cousin Dudley, and lives a very unremarkable life with only the odd hiccup (like his hair growing back overnight!) to cause him much to think about. That is until an owl turns up with a letter addressed to Harry and all hell breaks loose! He is literally rescued by a world where nothing is as it seems and magic lessons are the order of the day. Read and find out how Harry discovers his true heritage at Hogwarts School of Wizardry and Witchcraft, the reason behind his parents mysterious death, who is out to kill him, and how he uncovers the most amazing secret of all time, the fabled Philosopher\'s Stone! All this and muggles too. Now, what are they?',
    pagecount: 223,
    categories: [ 'Juvenile Fiction' ],
    language: 'en',
    imagelink: 'http://books.google.com/books/content?id=yZ1APgAACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api',
    volumelink: "http://books.google.com/books/about/Harry_Potter_1_and_the_Philosopher_s_Sto.html?hl=&id=yZ1APgAACAAJ"
  },

  {
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
  },

  {
    isbn: "9781451678192",
    title: 'The Martian Chronicles',
    subtitle: "",
    authors: [ 'Ray Bradbury' ],
    publisher: 'Simon and Schuster',
    publisheddate: '2012-04-17',
    description: 'The tranquility of Mars is disrupted by humans who want to conquer space, colonize the planet, and escape a doomed Earth.',
    pagecount: 256,
    categories: [ 'Fiction' ],
    language: 'en',
    imagelink: 'http://books.google.com/books/content?id=HzQXlPS48PQC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
    volumelink: "http://books.google.com/books/about/The_Martian_Chronicles.html?hl=&id=HzQXlPS48PQC"
  },

  {
    title: "Give My Regards to Eighth Street",
    subtitle: "Collected Writings of Morton Feldman",
    authors: [
     "Morton Feldman"
    ],
    publisheddate: "2000",
    description: "Afterword by Frank O'Hara Morton Feldman (1926-1987) is among the most influential American composers of the 20th Century. While his music is known for its exteme quiet and delicate beauty, Feldman himself was famously large and loud. His writings are both funny and illuminating, not only about his own music but about the entire New York School of painters, poets and composers that coalesced in the 1950s, including his friends Jackson Pollack, Philip Guston, Mark Rothko, Robert Rauschenberg, Frank O Hara, and John Cage.",
    isbn: "1878972316",
    pagecount: 222,
    categories: [
     "Literary Collections"
    ],
    imagelink: "http://books.google.com/books/content?id=iO4YAQAAIAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
    language: "en",
    volumelink: "http://books.google.com/books/about/Give_My_Regards_to_Eighth_Street.html?hl=&id=iO4YAQAAIAAJ"
  },

  {
    isbn: "9780393918298",
    "title": "A History of Western Music (Ninth Edition)",
    "authors": [
     "J. Peter Burkholder",
     "Donald Jay Grout",
     "Claude V. Palisca"
    ],
    "publisher": "W. W. Norton",
    "publisheddate": "2014-04-15",
    "description": "The definitive history of Western music, now with Total Access. Combining current scholarship with cutting-edge pedagogy, the Ninth Edition of A History of Western Music is the text that students and professors have trusted for generations. Because listening is central to music history, the new Total Access program provides a full suite of media resources—including an ebook and premium streaming recordings of the entire Norton Anthology of Western Music repertoire—with every new text. Combining thoughtful revisions—particularly to chapters on the twentieth and twenty-first centuries—with exceptional media resources, A History of Western Music provides all the resources that students need in a text that will last a lifetime.",
    "pagecount": 1200,
    "categories": [
     "Music"
    ],
    "imagelink": "http://books.google.com/books/content?id=dl9OnQEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
    "language": "en",
    "volumelink": "http://books.google.com/books/about/A_History_of_Western_Music_Ninth_Edition.html?hl=&id=dl9OnQEACAAJ"
  },

  {
    "title": "Structural Hearing",
    "subtitle": "Tonal Coherence in Music",
    "authors": [
     "Felix Salzer"
    ],
    "publisher": "Courier Corporation",
    "publisheddate": "1962",
    "description": "Written by a pupil of Heinrich Schenker, this outstanding work develops and extends Schenker's approach. More than 500 examples of music from the Middle Ages to the 20th century complement the detailed discussions and analyses.",
    isbn: "9780486222752",
    "pagecount": 632,
    "categories": [
     "Music"
    ],
    "imagelink": "http://books.google.com/books/content?id=GzaYCgAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
    "language": "en",
    "volumelink": "http://books.google.com/books/about/Structural_Hearing.html?hl=&id=GzaYCgAAQBAJ"
  },

  {
    "title": "HTML and CSS",
    "subtitle": "Design and Build Websites",
    "authors": [
     "Jon Duckett"
    ],
    "publisher": "John Wiley & Sons",
    "publisheddate": "2011-11-08",
    "description": "Presents information on using HTML and CSS to create Web pages, covering such topics as lists, links, images, tables, forms, color, layout, and video and audio.",
    isbn: "9781118008188",
    "pagecount": 512,
    "categories": [
     "Computers"
    ],
    "imagelink": "http://books.google.com/books/content?id=aGjaBTbT0o0C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
    "language": "en",
    "volumelink": "http://books.google.com/books/about/HTML_and_CSS.html?hl=&id=aGjaBTbT0o0C"
  },

  {
    "title": "The Universal History of Computing",
    "subtitle": "From the Abacus to the Quantum Computer",
    "authors": [
     "Georges Ifrah"
    ],
    "publisher": "Wiley",
    "publisheddate": "2002-01-10",
    "description": "\"A fascinating compendium of information about writing systems–both for words and numbers.\" –Publishers Weekly \"A truly enlightening and fascinating study for the mathematically oriented reader.\" –Booklist \"Well researched. . . . This book is a rich resource for those involved in researching the history of computers.\" –The Mathematics Teacher In this brilliant follow-up to his landmark international bestseller, The Universal History of Numbers, Georges Ifrah traces the development of computing from the invention of the abacus to the creation of the binary system three centuries ago to the incredible conceptual, scientific, and technical achievements that made the first modern computers possible. Ifrah takes us along as he visits mathematicians, visionaries, philosophers, and scholars from every corner of the world and every period of history. We learn about the births of the pocket calculator, the adding machine, the cash register, and even automata. We find out how the origins of the computer can be found in the European Renaissance, along with how World War II influenced the development of analytical calculation. And we explore such hot topics as numerical codes and the recent discovery of new kinds of number systems, such as \"surreal\" numbers. Adventurous and enthralling, The Universal History of Computing is an astonishing achievement that not only unravels the epic tale of computing, but also tells the compelling story of human intelligence–and how much further we still have to go.",
    isbn: "9780471441472",
    "pagecount": 416,
    "categories": [
     "Mathematics"
    ],
    "imagelink": "http://books.google.com/books/content?id=fFdKPgAACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
    "language": "en",
    "volumelink": "http://books.google.com/books/about/The_Universal_History_of_Computing.html?hl=&id=fFdKPgAACAAJ"
  },

  {
    "title": "Linear Algebra and Its Applications",
    "authors": [
     "Gilbert Strang"
    ],
    "publisher": "Editorial Paraninfo",
    "publisheddate": "2006",
    "description": "Strang demonstrates that linear algebra is a fascinating subject by showing both its beauty and value. While the mathematics is there, the effort is not all concentrated on the proofs. Strang's emphasis is on providing understanding.",
    isbn: "9780030105678",
    "pagecount": 487,
    "categories": [
     "Mathematics"
    ],
    "imagelink": "http://books.google.com/books/content?id=8QVdcRJyL2oC&printsec=frontcover&img=1&zoom=5&source=gbs_api",
    "language": "en",
    "volumelink": "http://books.google.com/books/about/Linear_Algebra_and_Its_Applications.html?hl=&id=8QVdcRJyL2oC"
  },

  {
    "title": "Black House",
    "authors": [
     "Stephen King",
     "Peter Straub"
    ],
    "publisher": "Ballantine Books",
    "publisheddate": "2001",
    "description": "A retired Los Angeles homicide detective living in the rural Wisconsin hamlet of Tamarack, Jack Sawyer is called in to assist the local police chief in solving a gruesome series of murders that causes Jack to experience inexplicable waking nightmares and draws him back to the Territories and an encounter with his own hidden past, in the long-awaited sequel to The Talisman. Reprint.",
    isbn: "9780345441034",
    "pagecount": 658,
    "categories": [
     "Fiction"
    ],
    "imagelink": "http://books.google.com/books/content?id=pq9h0UyTjhIC&printsec=frontcover&img=1&zoom=5&source=gbs_api",
    "language": "en",
    "volumelink": "http://books.google.com/books/about/Black_House.html?hl=&id=pq9h0UyTjhIC"
  },

  {
    "title": "A Choice of Byron's Verse",
    "authors": [
     "George Gordon Byron Baron Byron",
     "Douglas Dunn"
    ],
    "publisher": "Faber & Faber",
    "publisheddate": "1974-01-01",
    isbn: "9780571105892",
    "pagecount": 159,
    "categories": [
     "Poetry"
    ],
    "imagelink": "http://books.google.com/books/content?id=KhWaQgAACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
    "language": "en",
    "volumelink": "http://books.google.com/books/about/A_Choice_of_Byron_s_Verse.html?hl=&id=KhWaQgAACAAJ"
  },

  {
    "title": "Le petit prince",
    "authors": [
     "Antoine de Saint-Exupéry"
    ],
    "publisher": "Houghton Mifflin Harcourt",
    "publisheddate": "2001-09-01",
    "description": "A small boy learns of the wonders and ironies of life during a celestial odyssey.",
    isbn: "9780152164157",
    "pagecount": 85,
    "categories": [
     "Juvenile Fiction"
    ],
    "imagelink": "http://books.google.com/books/content?id=elZSm9GK66IC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
    "language": "en",
    "volumelink": "http://books.google.com/books/about/Le_petit_prince.html?hl=&id=elZSm9GK66IC"
  }
];

module.exports = {
  users: users,
  books: books
};
