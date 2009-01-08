require 'rubygems'
begin
  require 'rake'
rescue LoadError
  puts 'This script should only be accessed via the "rake" command.'
  puts 'Installation: gem install rake -y'
  exit
end
require 'rake'
require 'rake/clean'

APP_VERSION = '0.0.1'
APP_NAME = 'attributes'
APP_TEMPLATE = "#{APP_NAME}.js.erb"
APP_FILE_NAME= "#{APP_NAME}.js"

APP_ROOT     = File.expand_path(File.dirname(__FILE__))
APP_SRC_DIR  = File.join(APP_ROOT, 'src')
APP_DIST_DIR = File.join(APP_ROOT, 'dist')

CLEAN.include [ "#{APP_DIST_DIR}/#{APP_NAME}.js", "#{APP_DIST_DIR}/#{APP_NAME}-#{APP_VERSION}.js" ]


task :default => [ :dist ]

desc "Builds the distribution"
task :dist do
  $:.unshift File.join(APP_ROOT, 'lib')
  require 'protodoc'
  require 'fileutils'
  FileUtils.mkdir_p APP_DIST_DIR

  Dir.chdir(APP_SRC_DIR) do
    File.open(File.join(APP_DIST_DIR, APP_FILE_NAME), 'w+') do |dist|
      dist << Protodoc::Preprocessor.new(APP_TEMPLATE)
    end
  end
  Dir.chdir(APP_DIST_DIR) do
    FileUtils.copy_file APP_FILE_NAME, "#{APP_NAME}-#{APP_VERSION}.js"
  end  
end
