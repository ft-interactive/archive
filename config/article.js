export default () => ({ // eslint-disable-line

  // link file UUID
  id: '927ca86e-d29b-11e2-88ed-00144feab7de',

  // canonical URL of the published page
  // https://ig.ft.com/archive get filled in by the ./configure script
  url: 'https://ig.ft.com/archive',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2013-06-12T20:11:00Z'),

  headline: 'How much is your personal data worth?',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'Use our calculator to check how much multibillion-dollar data broker industry might pay for your personal data',

  topic: {
    name: 'Media',
    url: 'https://www.ft.com/companies/media',
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
    { name: 'Emily Steel', url: 'https://www.ft.com/stream/cf8610aa-424a-3dac-94b1-71778d038f70' },
    { name: 'Callum Locke', url: 'https://www.ft.com/callum-locke' },
    { name: 'Emily Cadman', url: 'https://www.ft.com/stream/fd6734a1-3ae2-30f3-98a1-e373f8da8bf1' },
    { name: 'Ben Freese', url: 'https://www.ft.com/stream/e5164c9c-ab66-3e1e-bc69-da3767b77c98' },
  ],

  // Appears in the HTML <title>
  title: 'How much is your personal data worth?',

  // meta data
  description: 'While the multibillion-dollar data broker industry profits from the trade of thousands of details about individuals, those bits of information are often sold for a fraction of a penny apiece, according to industry pricing data viewed by the Financial Times',

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
  // socialImage: '',
  // socialHeadline: '',
  // socialSummary:  '',

  // TWITTER
  // twitterImage: '',
  // twitterCreator: '@individual's_account',
  // tweetText:  '',
  // twitterHeadline:  '',

  // FACEBOOK
  // facebookImage: '',
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
