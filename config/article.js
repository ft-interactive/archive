export default () => ({ // eslint-disable-line

  // link file UUID
  id: '1392ab72-64e2-11e4-ab2d-00144feabdc0',

  // canonical URL of the published page
  // https://ig.ft.com/archive get filled in by the ./configure script
  url: 'https://ig.ft.com/archive',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2014-11-06T11:21:00Z'),

  headline: 'World’s fastest lifts race to the top of the tallest buildings',

  // summary === standfirst (Summary is what the content API calls it)
  summary: '',

  topic: {
    name: 'Industrials',
    url: 'https://www.ft.com/companies/industrials',
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
    { name: 'Tanya Powley', url: 'https://www.ft.com/stream/authorsId/Q0ItMDAwMDg0MA==-QXV0aG9ycw==' },
    { name: 'John Burn-Murdoch', url: 'https://www.ft.com/john-burn-murdoch' },
    { name: 'Cleve Jones', url: 'https://www.ft.com/stream/authorsId/Q0ItQ0o2Nzg5MA==-QXV0aG9ycw==' },
  ],

  // Appears in the HTML <title>
  title: 'World’s fastest lifts race to the top of the tallest buildings',

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
