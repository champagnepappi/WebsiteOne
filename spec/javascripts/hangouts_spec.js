describe('hangouts', function(){

  describe('#renderHangoutButton', function() {

    var oldGapi;

    beforeEach(function () {
      oldGapi = (typeof(gapi) === 'undefined') ? undefined : gapi;
      gapi = undefined;
    });

    afterEach(function() {
      gapi = oldGapi;
    });

    describe('WebsiteOne #renderHangoutButton', function() {

      beforeEach(function () {
        setFixtures(sandbox({
          id: 'liveHOA-placeholder',
          'data-topic': 'Topic',
          'data-app-id': 'id_1234',
          'data-callback-url': 'http://test.com'
        }));

        hangout = jasmine.createSpyObj('hangout', ['render']);
        gapi = { hangout: hangout };
      });

      describe('renders hangout button', function() {

        it('renders hangout button with correct parameters', function() {
          WebsiteOne.renderHangoutButton();

          expect(hangout.render).toHaveBeenCalledWith( 'liveHOA-placeholder', {
            render: 'createhangout',
            topic: 'Topic',
            hangout_type: 'onair',
            initial_apps: [{
              app_id : 'id_1234',
              start_data :'http://test.com',
              app_type : 'ROOM_APP'
            }],
            widget_size: 200
          });
        });
      });

      it('does not render hangout button', function() {
        it('if placeholder div is not loaded', function() {
          setFixtures('');
          WebsiteOne.renderHangoutButton();
          expect(hangout.render).not.toHaveBeenCalled();
        });

        it('if hangouts api is not loaded', function() {
          gapi = undefined;
          WebsiteOne.renderHangoutButton();
          expect(hangout.render).not.toHaveBeenCalled();
        });

        it('if hangout button has been already rendered', function() {
          $('#liveHOA-placeholder').html('<iframe></iframe>')
          WebsiteOne.renderHangoutButton();
          expect(hangout.render).not.toHaveBeenCalled();
        });
      });
    });

    describe('#loadHangoutsApi', function() {

      beforeEach(function () {
        spyOn(jQuery, 'ajax').and.returnValue(
          { done: function(callback) { callback(); } }
        );
      });

      describe('hangouts api is not yet loaded', function() {
        it('loads api library for hangouts', function() {
          WebsiteOne.loadHangoutsApi();

          expect(jQuery.ajax).toHaveBeenCalledWith({
            url: 'https://apis.google.com/js/platform.js',
            dataType: "script",
            cache: true
          });
        });

        it('renders HangoutButton on api load', function() {
          spyOn(WebsiteOne, 'renderHangoutButton');
          WebsiteOne.loadHangoutsApi();
          expect(WebsiteOne.renderHangoutButton).toHaveBeenCalled();
        });
      });

      describe('hangouts api is not yet loaded', function() {
        it('does not load api library if it is already loaded', function() {
          gapi = [];
          WebsiteOne.loadHangoutsApi();
          expect(jQuery.ajax).not.toHaveBeenCalled();
        });
      });
    });
  });
});
