.PHONY: serve install clean

# -----------------------------------------------------------------------------
#  CONSTANTS
# -----------------------------------------------------------------------------

ruby_v = 2.6.3
bundler_v = 1.17.2

ruby_v_file = .ruby-version
gemfile = Gemfile
gemfile_lock = Gemfile.lock

# -----------------------------------------------------------------------------
#  DEPENDENCIES
# -----------------------------------------------------------------------------

install: $(ruby_v_file)
	gem install bundler --version $(bundler_v)
	bundle install
	npm install

$(ruby_v_file):
	rbenv install $(ruby_v) -s
	rbenv local $(ruby_v)

# -----------------------------------------------------------------------------
#  SERVE
# -----------------------------------------------------------------------------

serve:
	npm run watch
	bundle exec jekyll serve

serve-incremental:
	npm run watch
	bundle exec jekyll serve --incremental

# -----------------------------------------------------------------------------
#  CLEANUP
# -----------------------------------------------------------------------------

clean:
	rm -rf $(ruby_v_file)
