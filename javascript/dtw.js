(function(window, document, undefined){
    var inputs = {
            ax: [],
            ay: [],
            az: [],
            gx: [],
            gy: [],
            gz: [],
        };

    // There are more optimal ways to run this algorithm. This is the just the simplest [this is o(nxm)! ew!].
    // Please research and update for performance.
    var DTWDistance = function(input, t){
        var DTW = [], // size = n x m
            i,j, //counters
            n = input.length,
            m = t.length,
            infinity = 999999; // pretty much infinity...

        // set top row of first column of matrix as infinity
        for(i=0; i<n;i++){
            DTW[i] = []; //make this a matrix
            DTW[i][0] = infinity;
        }
        for(i=1;i<m;i++){
            DTW[0][i] = infinity;
        }

        DTW[0][0] = 0;

        // calculate distance, save in matrix
        for(i=1;i<n;i++){
            for(j=1;j<m;j++){
                cost = Math.abs((input[i] - t[j])/360);
                DTW[i][j] = cost + Math.min(DTW[i-1][j], DTW[i][j-1], DTW[i-1][j-1]);
            }
        }

        // distance between the two sets
        return DTW[n-1][m-1];
    };

    // add new timepoint - expecting JSON data containing ax, ay, az, gx, gy, gz
    var addInput = function(data){
        var toParse = JSON.parse(data);

        Object.keys(inputs).forEach(function(option){
            inputs[option][inputs[option].length] = parseFloat(toParse[option]);
            if(inputs[option].length > 120){ // save the last 120 time points for each input array
                inputs[option].shift();
            }
        });

        return(getScore());
    };

    // returns the DTW score of all 6 arrays added
    var getScore = function(){
        var total = 0;
        Object.keys(inputs).forEach(function(option){
            total += DTWDistance(inputs[option], training[option]);
        });
        return total;
    };


    // make available to window
    window.DTW = addInput;
})(this,document);