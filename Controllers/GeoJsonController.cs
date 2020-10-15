using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using GeoJSON.Net.Feature;
using GeoJSON.Net.Contrib.MsSqlSpatial;
using System.Collections.Generic;
using System;

namespace kmlparser_app.Controllers
{
    [ApiController]
    [Route("geojson")]
    public class GeoJsonController : ControllerBase
    {
        private readonly ILogger<GeoJsonController> _logger;

        public GeoJsonController(ILogger<GeoJsonController> logger)
        {
            _logger = logger;
        }

        [HttpPost("features")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public StatusCodeResult GetFeatures([FromBody] FeatureCollection featureCollection)
        {
            var myFeatures = featureCollection.Features;
            var myList = new List<WindsorFeature>();
            foreach(Feature feature in myFeatures)
            {
                WindsorFeature winFeat = new WindsorFeature();
                var geometry = feature.Geometry;
                var type = geometry.Type;
                try
                {
                    winFeat.WKT = feature.ToSqlGeometry().ToString();

                    if (feature.Properties.TryGetValue("name", out var name))
                    {
                        winFeat.Name = name.ToString();
                    }

                    if (feature.Properties.TryGetValue("description", out var description))
                    {
                        winFeat.Description = description.ToString();
                    }

                    myList.Add(winFeat);
                }
                catch (Exception ex)
                {
                    string logName = String.Empty;
                    if (feature.Properties.TryGetValue("name", out var name))
                    {
                        logName = name.ToString();
                    }
                    //need to write this somewhere and return it to the FE for the user
                    _logger.LogWarning(String.Format("Could not parse feature {0}", logName));
                }
                
            }
            var status = new StatusCodeResult(200);
            return status;
        }
    }
}
