
class Element
   attr_accessor :type, :name, :bv, :vs, :sovs
  def initialize(type, name, bv, vs, sovs)
    @type = type
    @name = name
    @bv = bv;
    @vs = vs
    @sovs = sovs.to_a
  end
end

class Elements < Hash
  def register(type, name, *args)
    self[name] = Element.new(type, name, *args)
  end
  def options_jump
    out = ["<option value=\"\"></option>"]
    self.values.select {|elem| elem.type == :jump}.each {|elem|
      out << %Q[<option value="#{elem.name}">#{elem.name}</option>]
    }
    out.join("\n")
  end
end

