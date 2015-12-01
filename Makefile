
TARGET = score_calc.html elements.js

all: ${TARGET}


score_calc.html: score_calc.rhtml
	erb score_calc.rhtml > score_calc.html

elements.js: score_calc.rb
	ruby score_calc.rb
clean:
	rm *~ ${TARGET}

