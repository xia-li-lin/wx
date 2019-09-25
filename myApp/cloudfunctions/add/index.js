// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const doubanbook = require('doubanbook');

cloud.init()

async function getDouban(isbn) {
  const url = 'https://book.douban.com/subject_search?search_text=' + isbn;
  const searchData = await axios.get(url);
  let reg = /window\.__DATA__ = "(.*)"/;
  if (reg.test(searchData.data)) {
    let searchResult = doubanbook(RegExp.$1)[0];
    return searchResult;
  }
}

// 云函数入口函数
exports.main = async (event) => {
  let { isbn, num1, num2 } = event;
  let bookInfo = await getDouban(isbn);

  return {
    isbn,
    bookInfo,
    result: num1 * num2
  }
}