/**
 * Created by HOUDR on 7/19/2016.
 */
'use strict';

function words(feeling){
	if (feeling === 'satisfied')
		return 'meow';
	else
		return 'hiss';
}

module.exports = {
	speaks : function(){
		// console.log('     =^.^=');
		return words('satisfied');
	}
};