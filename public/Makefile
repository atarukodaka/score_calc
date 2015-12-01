
TARGET = index.html elements.js

all: ${TARGET}


index.html: score_calc.rhtml
	erb score_calc.rhtml > index.html

elements.js: score_calc.rb
	ruby score_calc.rb
clean:
	rm *~ ${TARGET}

