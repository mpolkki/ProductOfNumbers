var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope,  $document) {

	/* the input array */
	$scope.numbers = null;

	/* the number of items in product */		
	$scope.vectorLen = 4;

	/* array dimension */
	$scope.arrayDim = 0;
 	
 	/* the indexes of the biggest product*/
	$scope.biggestProductX=-1;
	$scope.biggestProductY=-1;

	/* Returns a product of vectorLen numbers to east direction (x ingreases) from given starting position (x,y). 
	If these is no vectorLen numbers left in array, -1 is returned.
	Returns -1 in the case there is no enough number or the product (>=0) of numbers
	*/
	$scope.countNorth = function (x,y) {
		
		if ( x>($scope.arrayDim-$scope.vectorLen)) return -1;

		var product = $scope.numbers[y][x]; 
		
		for (i = 1; i < $scope.vectorLen; i++) { 
			
			product=product * $scope.numbers[y][x+i];
		}

		return product;
	}


	/* Returns a product of vectorLen numbers to south direction (y ingreases) from given starting position (x,y). 
	If these is no vectorLen numbers left in array, -1 is returned.
	Returns -1 in the case there is no enough number or the product (>=0) of numbers
	*/
	$scope.countSouth = function (x,y) {
		if ( y>($scope.arrayDim-$scope.vectorLen)) return -1;

		var product = $scope.numbers[y][x]; 
		
		for (i = 1; i < $scope.vectorLen; i++) { 
			product*=$scope.numbers[y+i][x];
		}
		
		return product;
	}

	/* Returns a product of vectorLen numbers to south-east direction (x and y ingreases) from given starting position (x,y). 
	If these is no vectorLen numbers left in array, -1 is returned.
	Returns -1 in the case there is no enough number or the product (>=0) of numbers
	*/
	$scope.countSouthEast = function (x,y) {
		if ( x>($scope.arrayDim-$scope.vectorLen) || y>($scope.arrayDim-$scope.vectorLen)) return -1;

		var product = $scope.numbers[y][x]; 
		
		for (i = 1; i < $scope.vectorLen; i++) { 
			product*=$scope.numbers[y+i][x+i];
		}
	
		return product;
	}

	/* Returns a product of vectorLen numbers to north-east direction (x increase, y decreases) from given starting position (x,y). 
	If these is no vectorLen numbers left in array, -1 is returned.
	Returns -1 in the case there is no enough number or the product (>=0) of numbers
	*/
	$scope.countNorthEast = function (x,y) {
		if ( x>($scope.arrayDim-$scope.vectorLen) || y<($scope.vectorLen-1)) return -1;

		var product = $scope.numbers[y][x]; 
		
		for (i = 1; i < $scope.vectorLen; i++) { 
			product*=$scope.numbers[y-i][x+i];
		}

		return product;
	}

	/* Calculates the product of vectorLen numbers starting from index (x,y).
	*  Returns the direction and value of the maximum product in array {dir value} where
	*  dir may have values 0=north, 1=north-east, 2=east etc. and value is maximum value of product 
	'  or -1 if no product could be calculated to any direction.
	*/
	$scope.calculateProduct = function (x,y) {
		/* calculate the product of numebr in four directions, i.e. to right, down
		and diagonally to right-upper and right-lower direction in array. The directions are
		named compass terms. No need to calculate west, north, north-west nor south-west 
		because of the nature on product: the order of items is interchangeable. */

		/* calculate the product to four direction from the starting point (x,y)*/
		var productRight = $scope.countNorth(x,y);
		var productDown = $scope.countSouth(x,y, $scope.numbers);
		var productDiagonalDown = $scope.countSouthEast(x,y, $scope.numbers);
		var productDiagonalUp = $scope.countNorthEast(x,y, $scope.numbers);
		
		/* find the biggest one and the direction of it */
		var biggest = productRight;
		var direction = 2;

		if (productDown>biggest) {
			biggest=productDown;
			direction = 4;			
		}
		
		if(productDiagonalDown>biggest) {
			biggest=productDiagonalDown;
			direction = 3;		
		}

		if(productDiagonalUp>biggest) {
			biggest=productDiagonalUp;
			direction = 1;
		}
		
		return [direction, biggest];
	};

	/* 
	* Calculate the maximum value of product of vectorLen positive integers towards any direction including dialogal directions
	* of the X*X array of positive integers. 
	* 	eulerNums The array of integers given by the user 
	* 	vectorLen The number of items in product, scaled down to dimension of the array, if it exceeds it
	*
	*	itemText The result is returned and set to this model attribute in the form of:
	*			Euler number is {value}. The vector starts at position [{x,y}] towards {east | south | north-east | south-east}
	*/
	$scope.calculateProducts = function () {
		$scope.vectorLenERROR = null;
		/* Split input to rows and cells */
		$scope.numbers = $scope.eulerNums.split('\n');
		
		/* find out dimension */
		$scope.arrayDim = $scope.numbers.length;
		
		/* scale down the vectorKLen if it exceeds the dimensions of the array*/
		if ( $scope.vectorLen > $scope.arrayDim ) {
			$scope.vectorLen = $scope.arrayDim;
		}

		/* parse the input array*/
		for(y=0; y<$scope.arrayDim; y++){
			/* linebreak is the*/
			$scope.numbers[y] = ($scope.numbers[y].split(' '));
			
			/*convert to 10-based integers*/
			for(x=0; x<$scope.arrayDim; x++ ){
				$scope.numbers[y][x]=parseInt($scope.numbers[y][x],10);
			}
		}
		
		/* loop throught all items and calculate product for them */
		var biggest=-1;
		for(y=0; y<$scope.arrayDim; y++ ){
			for(x=0; x<$scope.arrayDim; x++) {
				/* calculate the product in (x,y)*/
				var ret= $scope.calculateProduct(x,y);
				var value= ret[1];
				
				/* save the index of the biggest value and the direction of it*/
				if ( value>biggest) {
					biggest=value;
					dir = ret[0];

					$scope.biggestProductX = x;
					$scope.biggestProductY = y;
				}
			}
		}
		
		/* create the return*/
		var text = "Euler number is " + biggest +". The vector starts at position ["+$scope.biggestProductX+","+$scope.biggestProductY+"] towards ";
				
		$scope.itemsText = $scope.numbers[$scope.biggestProductY][$scope.biggestProductX];

		/* the directions are: 0=north, 1=north-east, 2=east etc. */
		if ( dir == '1') {
			$scope.resultText = text + "north-east";
			for ( i=1; i<$scope.vectorLen; i++ ) {
				$scope.itemsText += ',' +$scope.numbers[$scope.biggestProductY-i][$scope.biggestProductX+i];
			}
		}
		else if ( dir == '2' ) {
			$scope.resultText = text + "east";
			for ( i=1; i<$scope.vectorLen; i++ ) {
				$scope.itemsText += ',' +$scope.numbers[$scope.biggestProductY][$scope.biggestProductX+i];
			}
		}
		else if ( dir == '3') {
			$scope.resultText = text + "south-east";
			for ( i=1; i<$scope.vectorLen; i++ ) {
				$scope.itemsText += ',' +$scope.numbers[$scope.biggestProductY+i][$scope.biggestProductX+i];
			}
		}
		else if ( dir == '4') {
			$scope.resultText = text + "south";
			for ( i=1; i<$scope.vectorLen; i++ ) {
				$scope.itemsText += ',' +$scope.numbers[$scope.biggestProductY+i][$scope.biggestProductX];
			}
		}
 
		return $scope.itemsText;
	}
});
