import scrapy
from scrapy.selector import Selector
from scrapy.selector import HtmlXPathSelector
import json
import urlparse as parse
import urllib
from scrapy.linkextractors import LinkExtractor

from scrapy.http import FormRequest, Request
cookie = ""
urls = ['https://thecreatecoin.com/projects/bittreo-0414', 'https://thecreatecoin.com/projects/darb-0327', 'https://thecreatecoin.com/projects/vegascasino-0320']
class ThecreatecoinSpider(scrapy.Spider):
    name = 'thecreatecoin'
    start_urls = ['https://thecreatecoin.com/users/sign_in']

    def parse(self, response):
        # parse the security token
        token = response.xpath("/html/head/meta[6]/@content").extract_first()
        cookies = response.headers.getlist('Set-Cookie')
        print(cookies[0])
        cookie = cookies[0]
        print('token')
        print(token)
        url = 'https://thecreatecoin.com/users/sign_in?utf8=%E2%9C%93&authenticity_token=' + urllib.pathname2url(token) + '&user%5Bemail%5D=jarettrsdunn%2Btest%40gmail.com&user%5Bpassword%5D=w0rdp4ss&user%5Bremember_me%5D=on&commit=Sign+in'
        
        d = dict(parse.parse_qsl(parse.urlsplit(url).query))
        print(d)
        return scrapy.FormRequest.from_response(
            response,
            headers={
'Content-Type': 'application/x-www-form-urlencoded',
'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
'Referer': 'https://thecreatecoin.com/users/sign_in',
'Accept-Encoding': 'gzip, deflate, br',
'Cookie': cookies[0]},
            formdata = d,    callback = self.after_login
        )

    def after_login(self, response): #check login succeed before going on
        for page in urls:
            yield Request(url=page,headers={
'Content-Type': 'application/x-www-form-urlencoded',
'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
'Referer': 'https://thecreatecoin.com/users/sign_in',
'Accept-Encoding': 'gzip, deflate, br',
'Cookie': cookie},
            callback=self.action)
    def action(self, response):
        pageurl = str(response.url)
        le = LinkExtractor()
        f = open("../reddits.txt", "a")

        for link in le.extract_links(response):
            if 'reddit' in link.url or 'bitcointalk' in link.url:
            	print(link.url)
            	f.write(link.url + '\n')
