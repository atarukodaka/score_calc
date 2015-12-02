
TARGET = index.html bvsov.js

all: ${TARGET}


index.html: score_calc.rhtml
	erb score_calc.rhtml > index.html

bvsov.js: bvsov.csv 
	ruby bvsov.rb > bvsov.js
clean:
	rm -f *~ ${TARGET}

