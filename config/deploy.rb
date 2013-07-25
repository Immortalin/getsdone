require "github_api"

set :application, "getsdone"
set :scm, :git
set :repository,  "git@github.com:stephenhu/getsdone"
set :deploy_to, "/web/#{application}"
set :use_sudo, false
set :ssh_options, {:forward_agent => true}
default_run_options[:pty] = true

set :default_environment, {
  "PATH" => "$HOME/.rbenv/bin:$PATH"
}

set :user, "devops"
set :group, user
set :runner, user


#hostname  = Capistrano::CLI.ui.ask("server hostname: ")
hostname = "10.0.1.14"

set :host, "#{user}@#{hostname}"
# should allow for config file as well and prompt if not -T
role :web, host
role :app, host
role :db,  host

HOME = "/home/devops"

set :rails_env, :production
set :ruby_version, "1.9.2-p290"
set :postgres_port, "5432"

namespace :postgresql do

  desc "setup user"
  task :setup do
    run "#{sudo} -u postgres createuser --superuser $USER"
  end

  desc "create database"
  task :create, roles: :db do
    #run "createdb getsdone"
    run "psql -U devops getsdone -c 'grant all privileges on database \'getsdone\' to \'devops\''"
  end

end

namespace :ubuntu do

  desc "install common ubuntu packages"
  task :setup do

    pkgs = %w(git gcc make zlib1g-dev libxml2-dev libxml2 libxslt1.1 libxslt1-dev openssl libssl-dev g++ unzip sqlite3 libsqlite3-dev libpq-dev ntp libpcre3 libpcre3-dev)
    run "#{sudo} apt-get update -y"
    pkgs.each do |pkg|
      puts %{pkg}
      run "#{sudo} apt-get install #{pkg} -y"
    end

  end

end

namespace :github do

  desc "configure github environment"
  task :setup do
    email     = Capistrano::CLI.ui.ask("input email address: ")
    file      = "/home/devops/.ssh/id_rsa"
    public_file = "#{file}.pub"
    run "git config --global core.editor 'vi'"
    run "git config --global user.email '#{email}'"
    check = capture "if [ -f #{file} ]; then echo 'true'; fi"
    if check.empty?
      run "ssh-keygen -q -t rsa -C '#{email}' -N '' -f '#{file}'"
    end
    key = capture "cat #{public_file}"
    username  = Capistrano::CLI.ui.ask("input github username: ")
    password  = Capistrano::CLI.password_prompt("input github password: ")
    github = Github.new( login: username, password: password )
    github.users.keys.create( title: "capistrano generated", key: key )

  end

end

namespace :rbenv do

  desc "install rbenv"
  task :setup do
    check = capture "if [ -d #{HOME}/.rbenv ]; then echo 'true'; fi"
    if check.empty?
      run "git clone https://github.com/sstephenson/rbenv.git ~/.rbenv"
    end
    check2 = capture "if [ -f #{HOME}/.profile ]; then echo 'true'; fi"
    if check2.empty?
      #run "echo 'export LC_CTYPE=\"en_US.UTF-8\"' >> #{HOME}/.profile"
      # not needed if you setup ubuntu correctly
    end
    check3 = capture "if grep rbenv #{HOME}/.profile; then echo \"true\"; fi"
    if check3.empty?
      run "echo 'export PATH=\"#{HOME}/.rbenv/bin:$PATH\"' >> #{HOME}/.profile"
      run "echo 'eval \"$(rbenv init -)\"' >> #{HOME}/.profile"
    end
    check4 = capture "if [ -d #{HOME}/.rbenv/plugins/ruby-build ]; then echo 'true'; fi"
    if check4.empty?
      run "git clone https://github.com/sstephenson/ruby-build ~/.rbenv/plugins/ruby-build"
      run "rbenv rehash"
    end
    #run "export PATH=\"#{HOME}/.rbenv/bin:$PATH\""
    #run "eval \"$(rbenv init -)\""
    #run "export PATH=\"#{HOME}/.rbenv/bin:${PATH}\"; 'eval \"$(rbenv init -)\"'; rbenv"
    #run "export PATH=\"#{HOME}/.rbenv/bin:${PATH}\"; rbenv install #{ruby_version}"
    #check5 = capture "if [ -d #{HOME}/.rbenv/"
    run "rbenv install #{ruby_version}"
    run "rbenv global #{ruby_version}"
    run "rbenv rehash"

  end

end

