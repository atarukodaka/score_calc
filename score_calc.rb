
require 'ostruct'

class ScoreCalc
  attr_reader :elements
  def initialize
    @elements = {
      "novalue": OpenStruct.new({name: "novalue", type: :novalue, bv: 0, v: 0, v1: 0, dg: "n/a", sov: [0, 0, 0, 0, 0, 0, 0]}),

      ## Jump
      "3A": OpenStruct.new({name: "3A", type: :jump, bv: 8.5, v: 5.9, v1: 0, dg: "2A", sov: [-3, -2, -1, 0, 1, 2, 3]}),
      "3Lz": OpenStruct.new({name: "3Lz", type: :jump, bv: 6.0, v: 4.2, v1: 3.6, dg: "2Lz", sov:  [-2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1]}),
      "2Lz": OpenStruct.new({name: "2Lz",  type: :jump, bv: 2.1, v: 1.5, v1: 1.4, dg: "1Lz", sov: [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9]}),
      "3Lo": OpenStruct.new({name: "3Lo",  type: :jump, bv: 5.1, v: 3.6, dg: "2T", sov: [-2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1]}),
      "3T": OpenStruct.new({name: "3T",  type: :jump, bv: 4.3, v: 3.0, dg: "2T", sov: [-2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1]}),

      ## Spin
      "USp1": OpenStruct.new({name: "USp1", type: :spin, bv: 1.7, v: 1.2, sov: [-0.9, -0.6, -0.3, 0, 0.5, 1.0, 1.5]}),

      ## Step
      "StSq1": OpenStruct.new({name: "StSq1", type: :stsq, bv: 1.8, sov: [-0.9, -0.6, -0.3, 0, 0.5, 1.0, 1.5]}),
      "StSq2": OpenStruct.new({name: "StSq2", type: :stsq, bv: 2.6, sov: [-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5]}),
      "StSq3": OpenStruct.new({name: "StSq3", type: :stsq, bv: 3.3, sov: [-2.1, -1.4, -0.7, 0, 0.5, 1.0, 1.5]}),
      "StSq4": OpenStruct.new({name: "StSq4", type: :stsq, bv: 3.9, sov: [-2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1]}),
      "ChSq1": OpenStruct.new({name: "ChSq1", type: :stsq, bv: 2.0, sov: [-1.5, -1.0, -0.5, 0, 0.7, 1.4, 2.1]}),
    }
  end


  def write_elements_js
    fname = "elements.js"
    File.open(fname, "w"){|f|
      f.puts "var elements = {"
      f.puts @elements.map {|key, elem|
        sov_str = (-3..3).map {|i|
          %Q["#{i}": #{elem.sov[i+3]}]
        }.join(", ")
        %Q["#{elem.name}": { bv: "#{elem.bv}", v: "#{elem.v}", v1: "#{elem.v1}", dg: "#{elem.dg}", sov: {#{sov_str} }}]
      }.join(", \n")
      
      f.puts "}"
    }
  end
end


################################################################
if $0 == __FILE__ 
  sc = ScoreCalc.new
  sc.write_elements_js
end
