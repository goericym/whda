import os
import application
import unittest


class applicationTestCase(unittest.TestCase):

    def setUp(self):
        # application.application.config['TESTING'] = True
        self.app = application.application.test_client()

    def tearDown(self):
        pass

    def test_en_url(self):
        rv = self.app.get('/en',  follow_redirects=True)
        assert u'hello en' in rv.data

    def test_tw_url(self):
        rv = self.app.get('/tw',  follow_redirects=True)
        assert u'hello tw' in rv.data        

    def test_tw_about_url(self):
        rv = self.app.get('/tw/about',  follow_redirects=True)
        assert u'about tw' in rv.data   

if __name__ == '__main__':
    unittest.main()
