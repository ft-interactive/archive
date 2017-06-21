export default () => ({ // eslint-disable-line

  // link file UUID
  id: '27c2476a-9291-11e4-b213-00144feabdc0',

  // canonical URL of the published page
  // https://ig.ft.com/archive get filled in by the ./configure script
  url: 'https://ig.ft.com/archive',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2015-04-29T11:37:00Z'),
  publishedDate: new Date(),


  headline: 'Saudi Arabia’s royal family tree',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'How the princes in the House of Saud’s order of succession are related',

  topic: {
    name: 'Saudi Arabia',
    url: 'https://www.ft.com/topics/places/Saudi_Arabia',
  },

  relatedArticle: {
    text: '',
    url: '',
  },

  mainImage: {
    title: '',
    description: '',
    url: '',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Katie Carnie', url: 'https://www.ft.com/search?q=Katie+Carnie' },
    { name: 'Ben Freese', url: 'https://www.ft.com/search?q=Ben+Freese' },
  ],

  // Appears in the HTML <title>
  title: 'Saudi Arabia’s royal family tree',

  // meta data
  description: '',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
 socialImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3Aa89c74fa-56a2-11e7-80b6-9bfa4c1f83d2?source=ig&width=1400',
  // socialHeadline: '',
  // socialSummary:  '',

  // TWITTER
 twitterImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3Aa89c74fa-56a2-11e7-80b6-9bfa4c1f83d2?source=ig&width=1400',
  // twitterCreator: '@individual's_account',
  // tweetText:  '',
  // twitterHeadline:  '',

  // FACEBOOK
facebookImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3Aa89c74fa-56a2-11e7-80b6-9bfa4c1f83d2?source=ig&width=1400',
  // facebookHeadline: '',

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
