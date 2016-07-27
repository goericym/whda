import application
import unittest


class applicationTestCase(unittest.TestCase):

    def setUp(self):
        # application.application.config['TESTING'] = True
        self.app = application.application.test_client()

    def tearDown(self):
        pass

    def test_root_url(self):
        rv = self.app.get('/',  follow_redirects=True)
        print rv
        # print rv.data
        assert 'Control Panel' in rv.data
        self.assertEqual(rv.status_code, 200)


if __name__ == '__main__':
    unittest.main()
