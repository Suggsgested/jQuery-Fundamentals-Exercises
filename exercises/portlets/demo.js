



var Portlet = function(config) {
	
	var state = config.initialState,
		url = config.source,
		title = config.title,
		
		$element = $('<div class="portlet">' +
			'<ul class="actions"></ul>' +
			'<h2>' + title + '</h2>' +
			'<div class="content"></div>' +
		'</div>'),
		
		$content = $element.find('div.content'),
		$actions = $element.find('ul.actions'),
		
		actions = {
			"destroy" : { 
				text : "Close", 
				action : function() {
					$element.remove();
				} 
			},
			
			"refresh" : { 
				text : "Refresh", 
				action : function() {
					$content.load(url);
				} 
			},
			
			"toggle" : { 
				text : "Show/Hide", 
				action : function() {
					$content.toggle();
					state = state == 'open' ? 'closed' : 'open';
				} 
			}
		},
		
		open = function() {
			if (state == 'open') { return; }
			actions.toggle.action();
		},
		
		close = function() {
			if (state == 'closed') { return; }
			actions.toggle.action();
		},
		
		setSource = function(src) {
			url = src;
			actions.refresh.action();
		},
		
		_setupActions = function() {
			var html = '';
				
			jQuery.each(actions, function(c, t) {
				html += '<li class="' + c + '">' + t.text + '</li>';
			});
			
			$actions
				.append(html)
				.delegate('li', 'click', function(e) {
					actions[$(this).attr('class')].action();
				});
		};
	
	_setupActions();
	actions.refresh.action();
	
	if (state == 'closed') { 
		$content.hide(); 
	}
	
	// $.subscribe('/portlets/open', open);
	// $.subscribe('/portlets/close', close);
		
	return {
		toggle : actions.toggle.action,
		refresh : actions.refresh.action,
		destroy : actions.destroy.action,
		open : open,
		close : close,
		setSource : setSource,
		$element : $element
	};
};


$.each(portlets, function(i, p) {
	var portlet = Portlet({
		title : p,
		source : 'data/html/' + p + '.html',
		initialState : 'open'
	});
	
	portlet.$element.appendTo('body');	
});





/*	

	jQuery pub/sub plugin by Peter Higgins (dante@dojotoolkit.org)

	Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.

	Original is (c) Dojo Foundation 2004-2009. Released under either AFL or new BSD, see:
	http://dojofoundation.org/license for more information.

*/	

;(function(d){
	// the topic/subscription hash
	var cache = {};

	d.publish = function(/* String */topic, /* Array? */args){
		// summary: 
		//		Publish some data on a named topic.
		// topic: String
		//		The channel to publish on
		// args: Array?
		//		The data to publish. Each array item is converted into an ordered
		//		arguments on the subscribed functions. 
		//
		// example:
		//		Publish stuff on '/some/topic'. Anything subscribed will be called
		//		with a function signature like: function(a,b,c){ ... }
		//
		//	|		$.publish("/some/topic", ["a","b","c"]);
		if (!cache[topic]) { return; }
		d.each(cache[topic], function(){
			this.apply(d, args || []);
		});
	};

	d.subscribe = function(/* String */topic, /* Function */callback){
		// summary:
		//		Register a callback on a named topic.
		// topic: String
		//		The channel to subscribe to
		// callback: Function
		//		The handler event. Anytime something is $.publish'ed on a 
		//		subscribed channel, the callback will be called with the
		//		published array as ordered arguments.
		//
		// returns: Array
		//		A handle which can be used to unsubscribe this particular subscription.
		//	
		// example:
		//	|	$.subscribe("/some/topic", function(a, b, c){ /* handle data */ });
		//
		if(!cache[topic]){
			cache[topic] = [];
		}
		cache[topic].push(callback);
		return [topic, callback]; // Array
	};

	d.unsubscribe = function(/* Array */handle){
		// summary:
		//		Disconnect a subscribed function for a topic.
		// handle: Array
		//		The return value from a $.subscribe call.
		// example:
		//	|	var handle = $.subscribe("/something", function(){});
		//	|	$.unsubscribe(handle);
		
		var t = handle[0];
		d.each(cache[t], function(idx){
			if(this == handle[1]){
				cache[t].splice(idx, 1);
			}
		});
	};

})(jQuery);