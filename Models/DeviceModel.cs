namespace neismesk.Models
{
	public class DeviceModel
	{
		public int? Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }

		public int Status { get; set; }

		public int User { get; set; }

		public int Category { get; set; }

		public List<IFormFile> Images { get; set; }
	}
}
