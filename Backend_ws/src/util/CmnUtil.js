/**
 * --== Sample for format() ==========================================
 *      console.log("[{0}] Executed ".format(
 *          new Date().toISOString()
 *      ));
 * --=================================================================
 */

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}
