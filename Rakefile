#!/usr/bin/env rake
require "active_record"
require "active_record/fixtures"
require "digest/md5"
require "logger"
require "pg"
require "securerandom"
require "time"
require "yaml"

task :default => :help

env = ENV["RACK_ENV"] || "development"

namespace :db do

  desc "prepare environment"
  task :environment do

    @config = YAML.load_file("conf/database.yml")["#{env}"]
    ActiveRecord::Base.establish_connection @config

  end

  desc "migrate database"
  task :migrate => :environment do

    ActiveRecord::Migration.verbose = true
    ActiveRecord::Migrator.migrate("db/migrate")

  end

  desc "seed fixtures"
  task :seed => :environment do

    Dir.glob( "db/fixtures/*.yml").each do |f|

      ActiveRecord::Fixtures.create_fixtures( "db/fixtures",
        File.basename( f, ".*" ) )

    end

  end


end

desc "configuration"
task :config do

  require "highline/import"
  require "erb"

  file = File.dirname(__FILE__) + "/db/getsdone.db"
  username = ask("username: ")
  password = ask("password: ") {|q| q.echo = "*"}

  config = ERB.new(File.read("./conf/database.yml.erb"))
  contents = config.result(binding)

  file = File.open( "./conf/database.yml", "w" )
  file.write(contents)
  file.close

end

desc "generate help text"
task :help do

  puts "rake"
  puts "  config"
  puts "  db:create"
  puts "  db:migrate"
  puts "  db:seed"

end

