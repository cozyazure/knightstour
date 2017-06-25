import { KnightsTourPage } from './app.po';

describe('knights-tour App', () => {
  let page: KnightsTourPage;

  beforeEach(() => {
    page = new KnightsTourPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
