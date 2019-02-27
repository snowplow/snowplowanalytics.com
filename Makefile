.PHONY: serve install clean

# -----------------------------------------------------------------------------
#  CONSTANTS
# -----------------------------------------------------------------------------

ruby_v = 2.2.5
bundler_v = 1.16.3

ruby_v_file = .ruby-version
gemfile = Gemfile
gemfile_lock = Gemfile.lock

# -----------------------------------------------------------------------------
#  DEPENDENCIES
# -----------------------------------------------------------------------------

install: $(ruby_v_file)
	gem install bundler --version $(bundler_v)
	bundle install

$(ruby_v_file):
	rbenv install $(ruby_v) -s
	rbenv local $(ruby_v)

# -----------------------------------------------------------------------------
#  SERVE
# -----------------------------------------------------------------------------

serve: $(ruby_v_file)
	bundle exec jekyll serve

serve-incremental: $(ruby_v_file)
	bundle exec jekyll serve --incremental

# -----------------------------------------------------------------------------
#  CLEANUP
# -----------------------------------------------------------------------------

clean:
	rm -rf $(ruby_v_file)
