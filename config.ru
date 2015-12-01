# config.ru:
use Rack::Static, 
  :urls => ["/images", "/js", "/css"],
  :root => "/"
 
run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('/score_calc.html', File::RDONLY)
  ]
}