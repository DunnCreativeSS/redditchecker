import scrapy
from scrapy.selector import Selector
from scrapy.selector import HtmlXPathSelector
from scrapy.http import FormRequest, Request
urls = ['https://thecreatecoin.com/projects/bittreo-0414', 'https://thecreatecoin.com/projects/darb-0327', 'https://thecreatecoin.com/projects/vegascasino-0320']

class LoginSpider(scrapy.Spider):
    name = 'thecreatecoin.com'
    start_urls = ['https://thecreatecoin.com/users/sign_in']

    def parse(self, response):
        # parse the security token
        token = response.css('input[name=csrf-token]::attr(content)').extract_first()

        return scrapy.FormRequest.from_response(
            response,
            formdata = {
                'user': {
                    'email': 'jarettrsdunn+test@gmail.com',
                    'password': 'w0rdp4ss',
                    'remember_me':'on'
                },

                    'authenticity_token': token,
                    'commit': 'Sign in'
            },
            callback = self.after_login
        )

    def after_login(self, response): #check login succeed before going on
        dat = self.log(response.body)
        for page in urls:
            yield Request(url=page,
            callback=self.action)
    def action(self, response):
        pageurl = str(response.url)
        for sel in response.xpath('a'):
            item = IkeaItem()
            item['name'] = sel.xpath('text()').extract()
            item['link'] = sel.xpath('@href').extract()
            print(item)
        yield item