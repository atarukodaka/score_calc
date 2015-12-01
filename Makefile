

score_calc.html: score_calc.rhtml
	erb score_calc.rhtml > score_calc.html

clean:
	rm *~ score_calc.html

