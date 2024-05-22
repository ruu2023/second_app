class Post < ApplicationRecord
  before_create :set_posted_at
  validates :title, :content, presence: true
  belongs_to :user

  private

  def set_posted_at
    date = Time.now
    year = date.year
    month = date.month
    day = date.day
    self.posted_at = "#{year}-#{month}-#{day}"
  end
end
