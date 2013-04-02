class Action < ActiveRecord::Base

  has_many :hashtags, :dependent => :destroy
  has_many :tags, :through => :hashtags
  has_one :delegate, :dependent => :destroy

  belongs_to :user

  after_create :set_estimate

  def set_estimate
    self.estimate = self.created_at + self.duration.days.to_i
    self.save
  end

  def time_remaining

    rem = Getsdone::AppHelper.duration_calc(self.estimate)

    return rem

  end

  def get_assigner_name

    u = User.find_by_id(self.user_id)

    return u.name

  end

end

