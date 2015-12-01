
TARGET = index.html elements.js

all: ${TARGET}


index.html: score_calc.rhtml
	erb score_calc.rhtml > index.html

elements.js: sov.csv 
	ruby sov.rb > elements.js
clean:
	rm -f *~ ${TARGET}

