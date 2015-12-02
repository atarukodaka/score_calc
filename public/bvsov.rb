
require 'csv'

def run
  csv_fname = "bvsov.csv"
  table = CSV.table(csv_fname)


  elems = table.map{|row|
    sov_str = %Q[{"-3": #{row[:neg3]}, "-2": #{row[:neg2]}, "-1": #{row[:neg1]}, "0": #{row[:flat]}, "1": #{row[:pos1]}, "2": #{row[:pos2]}, "3": #{row[:pos3]}}]
    %Q["#{row[:element]}": {bv: "#{row[:bv]}", v: "#{row[:v]}", v1: "#{row[:v1]}", sov: #{sov_str}}]
  }.join(",\n")

  output = "var bvsov = {
#{elems}
}"

  return output
end

puts run()

